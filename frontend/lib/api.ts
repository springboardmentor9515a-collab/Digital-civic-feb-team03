type UserRole = "citizen" | "official";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
};

type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

type MeResponse = {
  message: string;
  user: AuthUser & {
    isVerified: boolean;
    governmentId: string | null;
    verificationDocument: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload?.message === "string" ? payload.message : "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location: string;
}) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(token: string) {
  return apiRequest<MeResponse>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getLocations(token: string) {
  return apiRequest<{ message: string; locations: string[] }>("/auth/locations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ─── Petition Types ──────────────────────────────────────────────

export type PetitionStatus = "under_review" | "active" | "resolved" | "rejected";
export type PetitionCategory =
  | "infrastructure"
  | "environment"
  | "public_safety"
  | "education"
  | "healthcare"
  | "other";

export type Petition = {
  _id: string;
  title: string;
  description: string;
  category: PetitionCategory;
  location: string;
  status: PetitionStatus;
  creator: {
    _id: string;
    name: string;
    email?: string;
    location?: string;
  };
  signatures: { user: string; signedAt: string }[];
  signatureCount?: number;
  officialResponse?: string | null;
  respondedBy?: {
    _id: string;
    name: string;
    email?: string;
    location?: string;
    role?: string;
  } | null;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PetitionListResponse = {
  petitions: Petition[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPetitions: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// ─── Petition APIs ───────────────────────────────────────────────

export async function createPetition(
  token: string,
  data: { title: string; description: string; category: PetitionCategory; location: string }
) {
  return apiRequest<Petition>("/petitions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getPetitions(params?: {
  location?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.location) query.set("location", params.location);
  if (params?.category) query.set("category", params.category);
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return apiRequest<PetitionListResponse>(`/petitions${qs ? `?${qs}` : ""}`);
}

export async function getPetitionById(id: string) {
  return apiRequest<Petition>(`/petitions/${id}`);
}

// ─── Signature APIs ──────────────────────────────────────────────

export async function signPetition(token: string, petitionId: string) {
  return apiRequest<{ message: string; signature: unknown }>(`/petitions/${petitionId}/sign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getSignatureCount(petitionId: string) {
  return apiRequest<{ petitionId: string; signatureCount: number }>(
    `/petitions/${petitionId}/signatures/count`
  );
}

// ─── Poll Types ──────────────────────────────────────────────

export type PollOptionResult = {
  option: string;
  votes: number;
  percentage: number;
};

export type Poll = {
  _id: string;
  title: string;
  options: string[];
  targetLocation: string;
  createdBy: string;
  totalVotes?: number;
  results?: PollOptionResult[];
  createdAt: string;
  updatedAt: string;
};

export type PollListResponse = {
  success: boolean;
  polls: Poll[];
};

// ─── Poll APIs ───────────────────────────────────────────────

export async function createPoll(
  token: string,
  data: { title: string; options: string[]; targetLocation: string }
) {
  return apiRequest<{ success: boolean; message: string; poll: Poll }>("/polls", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getPolls(token: string, location?: string) {
  const query = new URLSearchParams();
  if (location) query.set("location", location);
  const qs = query.toString();
  return apiRequest<PollListResponse>(`/polls${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPollById(token: string, id: string) {
  return apiRequest<Poll>(`/polls/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function voteOnPoll(
  token: string,
  id: string,
  selectedOption: string
) {
  return apiRequest<{ success: boolean; message: string; vote: any }>(
    `/polls/${id}/vote`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ selectedOption }),
    }
  );
}

// ─── Governance APIs ──────────────────────────────────────────────

export async function getGovernancePetitions(token: string, params?: {
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.location) query.set("location", params.location);
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiRequest<PetitionListResponse>(`/governance/petitions${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function respondToPetition(
  token: string,
  id: string,
  responseText: string,
  status: string
) {
  return apiRequest<{ success: boolean; message: string; petition: Petition }>(
    `/governance/petitions/${id}/respond`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ responseText, status }),
    }
  );
}

// ─── Reports APIs ───────────────────────────────────────────────

export type ReportData = {
  petitionsPerStatus: any[];
  signaturesPerPetition: any[];
  pollVotesPerLocation: any[];
};

export type ReportResponse = {
  success: boolean;
  generatedAt: string;
  filters: any;
  data: ReportData;
};

export async function getReports(
  token: string,
  params?: {
    location?: string;
    status?: string;
    from?: string;
    to?: string;
  }
) {
  const query = new URLSearchParams();
  if (params?.location) query.set("location", params.location);
  if (params?.status) query.set("status", params.status);
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);
  const qs = query.toString();
  return apiRequest<ReportResponse>(`/reports${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}
