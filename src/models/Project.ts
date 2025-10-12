import mongoose, { model, Schema } from "mongoose";

const PromptSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    code: { type: String, required: true },
}, { timestamps: true })

const ProjectSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    prompts: [PromptSchema]
}, { timestamps: true })

const Project = mongoose.models.Project || model("Project", ProjectSchema)

export default Project;