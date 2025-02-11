
import mongoose, { Schema, Document } from "mongoose";

export interface Post extends Document {
    title: string;
    content: string;
    slug: string;
    isPublished: boolean;
    author: Schema.Types.ObjectId;
}


const PostSchema: Schema<Post> = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },

    content: {
        type: String,
        required: true,
        minlength: 20,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const PostModel = (mongoose.models.Post as mongoose.Model<Post>) ||
    mongoose.model<Post>('Post', PostSchema);

export default PostModel;