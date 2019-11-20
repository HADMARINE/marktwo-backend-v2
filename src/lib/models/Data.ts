import { model, Schema, Model, Document } from 'mongoose';

const dataSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  maclink: {
    type: String,
    default: null
  },
  type: {
    type: String,
    required: true
  }
});

export interface DataDocument extends Document {
  title: string;
  content: string;
  img: string;
  link: string;
  maclink: string;
  type: string;
}

const Data: Model<DataDocument> = model('data', dataSchema);

export default Data;
