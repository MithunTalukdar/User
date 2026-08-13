import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, lowercase: true, trim: true, unique: true, required: true },
    username: { type: String, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    otpHash: { type: String, default: null },
    otpPurpose: { type: String, enum: ['registration', 'password_reset'], default: null },
    otpExpiresAt: { type: Date, default: null },
    otpCooldownUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const json = ret as Record<string, unknown>;
    json.id = (_doc._id as { toString(): string }).toString();
    delete json._id;
    delete json.passwordHash;
    delete json.otpHash;
    delete json.otpPurpose;
    delete json.otpExpiresAt;
    delete json.otpCooldownUntil;
    delete json.__v;
    return json;
  },
});

export const UserModel = mongoose.models.User || model('User', userSchema);
