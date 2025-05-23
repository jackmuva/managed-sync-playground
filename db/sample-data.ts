import { createSyncedObject, createUser, getUser, STATIC_USER } from "./queries";

const sampleRecords = [
  {
    "id": "51ceacf9-6572-592e-99b8-c4ff32ad10a1",
    "external_id": "1kfrvDN3SPpY30Dli_TLphL45iiFHE-QPtsnAN5KKPpo",
    "name": "Name Origins Super Bonus",
    "mime_type": "application/vnd.google-apps.document",
    "size": null,
    "url": "https://docs.google.com/document/d/1kfrvDN3SPpY30Dli_TLphL45iiFHE-QPtsnAN5KKPpo/edit?usp=drivesdk",
    "thumbnail_url": "https://lh3.googleusercontent.com/drive-storage/AJQWtBOZtm4Zk-QN-Gslo4UK49Cpu1UWW_bIJFU4HrZtGX8Zkguc5n_beCQSTA8lOFKY3ugsvY7byNKbfXw-ztRta15J4mEUXg9Mdzzhiy_O-yRfOlugJGvCD0nZ_CkT7w=s220",
    "created_at": 1499208182269,
    "updated_at": 1515802745476,
    "hash": {
      "type": "MD5"
    }
  },
  {
    "id": "ad0e9fc2-56e4-5b66-96e9-c8fc29495c6e",
    "external_id": "1OsyHTp4VEei0UR0TFKtyNxK_64UQn8HdpVH6Q5ibPGg",
    "name": "Mesopotamian Pomeranian - Hour 2",
    "mime_type": "application/vnd.google-apps.spreadsheet",
    "size": null,
    "url": "https://docs.google.com/spreadsheets/d/1OsyHTp4VEei0UR0TFKtyNxK_64UQn8HdpVH6Q5ibPGg/edit?usp=drivesdk",
    "thumbnail_url": "https://lh3.googleusercontent.com/drive-storage/AJQWtBOwE87901JD1zz5AhnRpLehjLH3N9fs5rzQWV_f7Rzh8ucrSGN56hFc8h_te6WJYN6ayhyV-kMXj-cEis3t-s0NMLuog7z-00OcgsVKRni-kd5E4QmTFBrslZRgmg=s220",
    "created_at": 1515816339021,
    "updated_at": 1515829460008,
    "hash": {
      "type": "MD5"
    }
  }
];

export async function insertSampleData() {
  console.log("Inserting sample synced objects...");
  
  // Ensure the static user exists and get the actual user ID
  let actualUserId: string;
  try {
    let user = await getUser(STATIC_USER.email);
    if (!user || user.length === 0) {
      console.log("Creating static user...");
      await createUser(STATIC_USER.email, "static-user-password", STATIC_USER.id);
      user = await getUser(STATIC_USER.email);
      console.log("✓ Static user created");
    } else {
      console.log("Static user already exists");
    }
    actualUserId = user[0].id;
    console.log(`Using user ID: ${actualUserId}`);
  } catch (error) {
    console.error("Failed to create static user:", error);
    return;
  }
  
  for (const record of sampleRecords) {
    // Map schema fields
    const id = record.id;
    const externalId = record.external_id;
    const createdAt = new Date(record.created_at);
    const updatedAt = new Date(record.updated_at);
    const userId = actualUserId;  // Use the actual user ID from database
    const source = "googledrive";
    
    // Put remaining fields in data as JSON
    const data = JSON.stringify({
      name: record.name,
      mime_type: record.mime_type,
      size: record.size,
      url: record.url,
      thumbnail_url: record.thumbnail_url,
      hash: record.hash
    });
    
    try {
      await createSyncedObject({
        id,
        externalId,
        createdAt,
        updatedAt,
        userId,
        data,
        source
      });
      console.log(`Inserted record: ${record.name}`);
    } catch (error) {
      console.error(`Failed to insert record ${record.name}:`, error);
    }
  }
  
  console.log("Sample data insertion complete!");
}

// Run the script if called directly
if (require.main === module) {
  insertSampleData().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error("Error inserting sample data:", error);
    process.exit(1);
  });
}
