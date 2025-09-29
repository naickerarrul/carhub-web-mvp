import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  roles: text('roles').notNull(), // comma-separated: CUSTOMER|PROVIDER|ADMIN
  createdAt: integer('created_at').notNull(),
});

export const vehicles = sqliteTable('vehicles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  plate: text('plate').notNull(),
  make: text('make'),
  model: text('model'),
  year: integer('year'),
  insurerName: text('insurer_name'),
  policyNo: text('policy_no'),
  policyValidFrom: integer('policy_valid_from'),
  policyValidTo: integer('policy_valid_to'),
  createdAt: integer('created_at').notNull(),
});

export const claims = sqliteTable('claims', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ref: text('ref').notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  incidentAt: integer('incident_at').notNull(),
  locationLat: real('location_lat').notNull(),
  locationLng: real('location_lng').notNull(),
  locationText: text('location_text'),
  policeReportNo: text('police_report_no'),
  insurerName: text('insurer_name'),
  insurerRef: text('insurer_ref'),
  status: text('status').notNull(), // CHECK IN [SUBMITTED,NEEDS_INFO,IN_REVIEW,APPROVED,REPAIR_ASSIGNED,IN_REPAIR,CLOSED,REJECTED,IN_LITIGATION]
  severity: text('severity').notNull(), // CHECK IN [UNKNOWN,MINOR,MODERATE,MAJOR,FATALITY]
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const claimEvents = sqliteTable('claim_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  claimId: integer('claim_id').notNull().references(() => claims.id),
  type: text('type').notNull(), // CHECK IN [CREATED,MEDIA_UPLOADED,DOC_REQUESTED,STATUS_CHANGED,PACKET_BUILT,PACKET_SENT,WORKSHOP_ASSIGNED,ESTIMATE_UPLOADED,NOTE]
  payload: text('payload'), // JSON
  actorType: text('actor_type').notNull(), // CHECK IN [USER,ADMIN,PROVIDER,SYSTEM]
  actorId: integer('actor_id'),
  createdAt: integer('created_at').notNull(),
});

export const mediaAssets = sqliteTable('media_assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  claimId: integer('claim_id').notNull().references(() => claims.id),
  kind: text('kind').notNull(), // CHECK IN [MY_CAR,OTHER_CAR,SCENE,INJURY,DOCUMENT]
  url: text('url').notNull(),
  mime: text('mime').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  checksum: text('checksum').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const assistanceRequests = sqliteTable('assistance_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ref: text('ref').notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  service: text('service').notNull(), // CHECK IN [TOW,TYRE,BATTERY,FUEL,LOCKOUT]
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  notes: text('notes'),
  status: text('status').notNull(), // CHECK IN [NEW,ASSIGNED,EN_ROUTE,ON_SCENE,COMPLETED,CANCELLED]
  providerId: integer('provider_id'),
  priceQuotedRm: real('price_quoted_rm'),
  priceFinalRm: real('price_final_rm'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const providers = sqliteTable('providers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // CHECK IN [TOW,WORKSHOP,BOTH]
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  serviceAreaGeojson: text('service_area_geojson'),
  rating: real('rating'),
  active: integer('active').notNull(), // 0/1
});

export const providerUsers = sqliteTable('provider_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  providerId: integer('provider_id').notNull().references(() => providers.id),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull(), // CHECK IN [OWNER,DISPATCHER,DRIVER,TECH]
});

export const workshopEstimates = sqliteTable('workshop_estimates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  claimId: integer('claim_id').notNull().references(() => claims.id),
  providerId: integer('provider_id').notNull().references(() => providers.id),
  partsJson: text('parts_json').notNull(),
  laborHours: real('labor_hours').notNull(),
  totalRm: real('total_rm').notNull(),
  etaDays: integer('eta_days'),
  filesJson: text('files_json'),
  status: text('status').notNull(), // CHECK IN [SUBMITTED,REVISED,APPROVED_BY_INSURER,REJECTED]
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  actorType: text('actor_type').notNull(),
  actorId: integer('actor_id'),
  action: text('action').notNull(),
  target: text('target').notNull(),
  beforeJson: text('before_json'),
  afterJson: text('after_json'),
  createdAt: integer('created_at').notNull(),
});