declare module 'mongoose-autopopulate' {
  import { Schema } from 'mongoose';
  const autopopulate: (schema: Schema) => void;
  export default autopopulate;
}


