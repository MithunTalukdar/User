import { db } from '../config/db';
import { UserModel } from '../models/User';
import { ProfileModel } from '../models/Profile';
import { AddressModel } from '../models/Address';
import type {
  AddressRecord,
  NewAddress,
  ProfileInput,
  UserRecord,
} from '../types';

export interface NewUser {
  fullName: string;
  email: string;
  passwordHash: string;
  username?: string;
  isVerified?: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface NewProfile extends ProfileInput {
  userId: string | null;
  variants: Record<string, string>;
  pinned?: boolean;
}

export interface ProfileDoc extends ProfileInput {
  id: string;
  userId: string | null;
  variants: Record<string, string>;
  pinned: boolean;
  createdAt: string;
}

export interface Repos {
  ready: boolean;
  user: {
    create(data: NewUser): Promise<UserRecord>;
    findByEmail(email: string): Promise<UserRecord | null>;
    findByUsername(username: string): Promise<UserRecord | null>;
    findById(id: string): Promise<UserRecord | null>;
    update(id: string, patch: Partial<UserRecord>): Promise<UserRecord | null>;
  };
  profile: {
    create(data: NewProfile): Promise<{ id: string }>;
    list(): Promise<ProfileDoc[]>;
    findById(id: string): Promise<ProfileDoc | null>;
    update(id: string, patch: Partial<ProfileDoc>): Promise<ProfileDoc | null>;
    remove(id: string): Promise<boolean>;
    togglePin(id: string): Promise<boolean>;
  };
  address: {
    listByUser(userId: string): Promise<AddressRecord[]>;
    create(userId: string, data: NewAddress): Promise<AddressRecord>;
    findById(id: string): Promise<AddressRecord | null>;
    update(id: string, patch: Partial<NewAddress>): Promise<AddressRecord | null>;
    remove(id: string): Promise<boolean>;
  };
}

interface MongoUserDoc {
  _id: { toString(): string };
  fullName: string;
  email: string;
  username?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified: boolean;
  passwordHash: string;
  otpHash?: string | null;
  otpPurpose?: 'registration' | 'password_reset' | null;
  otpExpiresAt?: Date | null;
  otpCooldownUntil?: Date | null;
  createdAt: Date;
}

interface MongoProfileDoc {
  _id: { toString(): string };
  userId?: { toString(): string };
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  skills?: string;
  company?: string;
  jobRole?: string;
  experience?: string;
  education?: string;
  projects?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  careerObjective?: string;
  additionalInfo?: string;
  template?: string;
  level?: string;
  pinned?: boolean;
  variants?: Record<string, string>;
  createdAt?: Date;
}

interface MongoAddressDoc {
  _id: { toString(): string };
  userId?: { toString(): string } | string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: Date;
}

function mapUser(doc: MongoUserDoc): UserRecord {
  return {
    id: doc._id.toString(),
    fullName: doc.fullName,
    email: doc.email,
    username: doc.username,
    phone: doc.phone ?? '',
    address: doc.address ?? '',
    avatar: doc.avatar ?? '',
    isVerified: doc.isVerified,
    passwordHash: doc.passwordHash,
    otpHash: doc.otpHash ?? null,
    otpPurpose: doc.otpPurpose ?? null,
    otpExpiresAt: doc.otpExpiresAt ?? null,
    otpCooldownUntil: doc.otpCooldownUntil ?? null,
    createdAt: doc.createdAt,
  };
}

function mapAddress(doc: MongoAddressDoc): AddressRecord {
  return {
    id: doc._id.toString(),
    userId: typeof doc.userId === 'string' ? doc.userId : doc.userId?.toString() ?? '',
    label: doc.label ?? 'Home',
    fullName: doc.fullName ?? '',
    phone: doc.phone ?? '',
    line1: doc.line1 ?? '',
    line2: doc.line2 ?? '',
    city: doc.city ?? '',
    state: doc.state ?? '',
    postalCode: doc.postalCode ?? '',
    country: doc.country ?? '',
    isDefault: doc.isDefault ?? false,
    createdAt: doc.createdAt?.toISOString() ?? '',
  };
}

function mapProfile(doc: MongoProfileDoc): ProfileDoc {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : null,
    fullName: doc.fullName ?? '',
    username: doc.username ?? '',
    email: doc.email ?? '',
    phone: doc.phone ?? '',
    skills: doc.skills ?? '',
    company: doc.company ?? '',
    jobRole: doc.jobRole ?? '',
    experience: doc.experience ?? '',
    education: doc.education ?? '',
    projects: doc.projects ?? '',
    github: doc.github ?? '',
    linkedin: doc.linkedin ?? '',
    portfolio: doc.portfolio ?? '',
    careerObjective: doc.careerObjective ?? '',
    additionalInfo: doc.additionalInfo ?? '',
    template: doc.template,
    level: (doc.level as ProfileDoc['level']) ?? 'mid',
    variants: doc.variants ?? {},
    pinned: doc.pinned ?? false,
    createdAt: doc.createdAt?.toISOString() ?? '',
  };
}

let mongoRepos: Repos;
let memoryRepos: Repos;

const generateId = () => {
  try {
    const crypto = require('crypto');
    if (crypto.randomUUID) return crypto.randomUUID();
  } catch (e) {}
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const memory = {
  users: new Map<string, UserRecord>(),
  profiles: new Map<string, ProfileDoc & { id: string }>(),
  addresses: new Map<string, AddressRecord & { userId: string }>(),
};

function buildMemoryRepos(): Repos {
  return {
    ready: true,
    user: {
      async create(data) {
        const now = new Date();
        const rec: UserRecord = {
          id: generateId(),
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          username: data.username,
          phone: data.phone ?? '',
          address: data.address ?? '',
          avatar: data.avatar ?? '',
          isVerified: data.isVerified ?? false,
          passwordHash: data.passwordHash,
          otpHash: null,
          otpPurpose: null,
          otpExpiresAt: null,
          otpCooldownUntil: null,
          createdAt: now,
        };
        if ([...memory.users.values()].some((u) => u.email === rec.email)) {
          const err = new Error('Email already exists') as Error & { code?: number };
          err.code = 11000;
          throw err;
        }
        memory.users.set(rec.id, rec);
        return rec;
      },
      async findByEmail(email) {
        return (
          [...memory.users.values()].find((u) => u.email === email.toLowerCase()) || null
        );
      },
      async findByUsername(username) {
        return (
          [...memory.users.values()].find((u) => u.username === username.toLowerCase()) || null
        );
      },
      async findById(id) {
        return memory.users.get(id) || null;
      },
      async update(id, patch) {
        const cur = memory.users.get(id);
        if (!cur) return null;
        const next = { ...cur, ...patch, id };
        memory.users.set(id, next);
        return next;
      },
    },
    profile: {
      async create(data) {
        const doc: ProfileDoc & { id: string } = {
          ...data,
          id: generateId(),
          pinned: data.pinned ?? false,
          createdAt: new Date().toISOString(),
        };
        memory.profiles.set(doc.id, doc);
        return { id: doc.id };
      },
      async list() {
        return [...memory.profiles.values()].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
      },
      async findById(id) {
        return memory.profiles.get(id) || null;
      },
      async update(id, patch) {
        const cur = memory.profiles.get(id);
        if (!cur) return null;
        const next = { ...cur, ...patch, id };
        memory.profiles.set(id, next);
        return next;
      },
      async remove(id) {
        return memory.profiles.delete(id);
      },
      async togglePin(id) {
        const cur = memory.profiles.get(id);
        if (!cur) return false;
        cur.pinned = !cur.pinned;
        memory.profiles.set(id, cur);
        return cur.pinned;
      },
    },
    address: {
      async listByUser(userId) {
        return [...memory.addresses.values()]
          .filter((a) => a.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
      async create(userId, data) {
        const doc: AddressRecord & { userId: string } = {
          ...data,
          id: generateId(),
          userId,
          createdAt: new Date().toISOString(),
        };
        if (doc.isDefault) {
          for (const other of memory.addresses.values()) {
            if (other.userId === userId) other.isDefault = false;
          }
        }
        memory.addresses.set(doc.id, doc);
        return doc;
      },
      async findById(id) {
        return memory.addresses.get(id) || null;
      },
      async update(id, patch) {
        const cur = memory.addresses.get(id);
        if (!cur) return null;
        if (patch.isDefault) {
          for (const other of memory.addresses.values()) {
            if (other.userId === cur.userId && other.id !== id) other.isDefault = false;
          }
        }
        const next = { ...cur, ...patch, id };
        memory.addresses.set(id, next);
        return next;
      },
      async remove(id) {
        return memory.addresses.delete(id);
      },
    },
  };
}

function buildMongoRepos(): Repos {
  return {
    ready: true,
    user: {
      async create(data) {
        const doc = await UserModel.create(data);
        return mapUser({
          _id: doc._id,
          fullName: doc.fullName,
          email: doc.email,
          username: doc.username,
          phone: doc.phone,
          address: doc.address,
          avatar: doc.avatar,
          isVerified: doc.isVerified,
          passwordHash: doc.passwordHash,
          createdAt: doc.createdAt,
        });
      },
      async findByEmail(email) {
        const doc = (await UserModel.findOne({ email: email.toLowerCase() }).lean()) as unknown as MongoUserDoc | null;
        if (!doc) return null;
        return mapUser(doc);
      },
      async findByUsername(username) {
        const doc = (await UserModel.findOne({ username: username.toLowerCase() }).lean()) as unknown as MongoUserDoc | null;
        if (!doc) return null;
        return mapUser(doc);
      },
      async findById(id) {
        const doc = (await UserModel.findById(id).lean()) as unknown as MongoUserDoc | null;
        if (!doc) return null;
        return mapUser(doc);
      },
      async update(id, patch) {
        const allowed = [
          'fullName', 'email', 'username', 'phone', 'address', 'avatar', 'isVerified',
          'passwordHash', 'otpHash', 'otpPurpose', 'otpExpiresAt', 'otpCooldownUntil',
        ];
        const update: Record<string, unknown> = {};
        for (const key of allowed) {
          if (key in patch) update[key] = (patch as Record<string, unknown>)[key];
        }
        await UserModel.findByIdAndUpdate(id, update);
        return this.findById(id);
      },
    },
    profile: {
      async create(data) {
        const doc = await ProfileModel.create(data);
        return { id: doc.id };
      },
      async list() {
        const docs = (await ProfileModel.find().sort({ createdAt: -1 }).lean()) as unknown as MongoProfileDoc[];
        return docs.map(mapProfile);
      },
      async findById(id) {
        const doc = (await ProfileModel.findById(id).lean()) as unknown as MongoProfileDoc | null;
        if (!doc) return null;
        return mapProfile(doc);
      },
      async update(id, patch) {
        const allowed = [
          'fullName', 'username', 'email', 'phone', 'skills', 'company', 'jobRole',
          'experience', 'education', 'projects', 'github', 'linkedin', 'portfolio',
          'careerObjective', 'additionalInfo', 'template', 'level', 'variants', 'pinned',
        ];
        const update: Record<string, unknown> = {};
        for (const key of allowed) {
          if (key in patch) update[key] = (patch as Record<string, unknown>)[key];
        }
        await ProfileModel.findByIdAndUpdate(id, update);
        return this.findById(id);
      },
      async remove(id) {
        await ProfileModel.findByIdAndDelete(id);
        return true;
      },
      async togglePin(id) {
        const doc = await ProfileModel.findById(id);
        if (!doc) return false;
        doc.pinned = !doc.pinned;
        await doc.save();
        return doc.pinned;
      },
    },
    address: {
      async listByUser(userId) {
        const docs = (await AddressModel.find({ userId })
          .sort({ createdAt: -1 })
          .lean()) as unknown as MongoAddressDoc[];
        return docs.map(mapAddress);
      },
      async create(userId, data) {
        if (data.isDefault) {
          await AddressModel.updateMany({ userId }, { isDefault: false });
        }
        const doc = await AddressModel.create({ ...data, userId });
        return mapAddress({
          _id: doc._id,
          label: doc.label,
          fullName: doc.fullName,
          phone: doc.phone,
          line1: doc.line1,
          line2: doc.line2,
          city: doc.city,
          state: doc.state,
          postalCode: doc.postalCode,
          country: doc.country,
          isDefault: doc.isDefault,
          createdAt: doc.createdAt,
        });
      },
      async findById(id) {
        const doc = (await AddressModel.findById(id).lean()) as unknown as (MongoAddressDoc & { userId?: { toString(): string } }) | null;
        if (!doc) return null;
        return mapAddress(doc);
      },
      async update(id, patch) {
        const cur = await AddressModel.findById(id);
        if (!cur) return null;
        if (patch.isDefault) {
          await AddressModel.updateMany({ userId: cur.userId, _id: { $ne: cur._id } }, { isDefault: false });
        }
        const allowed = [
          'label', 'fullName', 'phone', 'line1', 'line2', 'city', 'state', 'postalCode',
          'country', 'isDefault',
        ];
        const update: Record<string, unknown> = {};
        for (const key of allowed) {
          if (key in patch) update[key] = (patch as Record<string, unknown>)[key];
        }
        await AddressModel.findByIdAndUpdate(id, update);
        const updated = (await AddressModel.findById(id).lean()) as unknown as MongoAddressDoc | null;
        return updated ? mapAddress(updated) : null;
      },
      async remove(id) {
        await AddressModel.findByIdAndDelete(id);
        return true;
      },
    },
  };
}

export function getRepos(): Repos {
  if (db.connected) {
    mongoRepos ||= buildMongoRepos();
    return mongoRepos;
  }
  memoryRepos ||= buildMemoryRepos();
  return memoryRepos;
}
