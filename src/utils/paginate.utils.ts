import { Model, Require_id, FlattenMaps, FilterQuery, model } from 'mongoose';
import { PaginateQuery } from 'src/common/dto/paginate-query.dto';

export interface Pagination extends PaginateQuery {
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
    populate?: string | string[] | any;
    sort?: Record<string, 1 | -1> | string;
    select?: string | Record<string, 1 | 0>;
    lean?: boolean;
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
}

export const paginate = async <T>({
    model,
    queryValues = {},
    project = {},
    options = {},
    lean = true,
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
        const [items, total] = await Promise.all([
            model
                .find(query, project, options)
                .skip(skip)
                .limit(limit)
                .lean(lean)
                .exec(),
            model.countDocuments(query, options).exec(),
        ]);

        return {
            items: items as Require_id<FlattenMaps<T>>[],
            meta: {
                total,
                count: items.length,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        throw new Error(`Error during pagination: ${error.message}`);
    }
};
