import { FilterQuery, FlattenMaps, Model, PopulateOptions, Require_id } from 'mongoose';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

export interface Pagination extends PaginateQuery {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface PaginationMeta {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginateResult<T> {
    items: Require_id<FlattenMaps<T>>[];
    meta: PaginationMeta;
}

export interface MongoOptions<T> {
    filter?: FilterQuery<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    populate?: string | string[] | any;
    sort?: Record<string, 1 | -1> | string;
    select?: string | Record<string, 1 | 0>;
    lean?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Paginate a collection of items.
 *
 * @param model - Mongoose Model.
 * @param queryValues - Query values.
 * @param project - Project options.
 * @param options - Mongoose options.
 * @returns Paginated result.
 */

interface PaginateOptions<T> {
    model: Model<T>;
    queryValues: Pagination;
    project?: MongoOptions<T>;
    options?: MongoOptions<T>;
    lean?: boolean;
    populate?: PopulateOptions[];
}

export const paginate = async <T>({
    model,
    queryValues = {},
    project = {},
    options = {},
    lean = true,
    populate = [],
}: PaginateOptions<T>): Promise<PaginateResult<T>> => {
    const { page = 1, limit = 10, ...rest } = queryValues;

    const skip = (page - 1) * limit;

    const query = Object.keys(rest).reduce((acc, key) => {
        if (rest[key]) {
            acc[key] = rest[key];
        }
        return acc;
    }, {});

    try {
        const queryInstance = model.find(query, project, options);

        if (populate) {
            queryInstance.populate(populate);
        }

        const [items, total] = await Promise.all([
            queryInstance.skip(skip).limit(limit).lean(lean).exec(),
            model.countDocuments(query, options).exec(),
        ]);

        return {
            items: items as Require_id<FlattenMaps<T>>[],
            meta: {
                total: Number(total),
                count: Number(items.length),
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(Number(total) / Number(limit)),
            },
        };
    } catch (error) {
        throw new Error(`Error during pagination: ${error.message}`);
    }
};
