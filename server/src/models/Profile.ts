import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const profileSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', index: true },
    fullName: String,
    username: String,
    email: String,
    phone: String,
    skills: String,
    company: String,
    jobRole: String,
    experience: String,
    education: String,
    projects: String,
    github: String,
    linkedin: String,
    portfolio: String,
    careerObjective: String,
    additionalInfo: String,
    template: { type: String, default: 'software-engineer' },
    level: { type: String, enum: ['beginner', 'mid', 'senior'], default: 'mid' },
    pinned: { type: Boolean, default: false },
    variants: { type: Map, of: String, default: {} },
  },
  { timestamps: true },
);

profileSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const json = ret as Record<string, unknown>;
    json.id = (_doc._id as { toString(): string }).toString();
    delete json._id;
    delete json.__v;
    return json;
  },
});

export const ProfileModel = mongoose.models.Profile || model('Profile', profileSchema);
