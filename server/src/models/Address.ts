import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, trim: true, default: 'Home' },
    fullName: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const json = ret as Record<string, unknown>;
    json.id = (_doc._id as { toString(): string }).toString();
    delete json._id;
    delete json.userId;
    delete json.__v;
    return json;
  },
});

export const AddressModel = mongoose.models.Address || model('Address', addressSchema);
