import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublishedPost extends Document {
  title: string;
  slug: string;
  featureImage?: string;
  contentHtml: string;
  category:
    | "result"
    | "admit-card"
    | "latest-jobs"
    | "answer-key"
    | "syllabus"
    | "admission";
  metaDescription: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PublishedPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    featureImage: String,
    contentHtml: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "result",
        "admit-card",
        "latest-jobs",
        "answer-key",
        "syllabus",
        "admission",
      ],
      index: true,
    },
    tags: { type: [String], default: [], index: true },
    metaDescription: { type: String, required: true },
    source_ref: { post_id: Number, slug: String, source_url: String },
  },
  { timestamps: true }
);

const PublishedPost: Model<IPublishedPost> =
  mongoose.models.PublishedPost ||
  mongoose.model<IPublishedPost>("PublishedPost", PublishedPostSchema);
export default PublishedPost;
