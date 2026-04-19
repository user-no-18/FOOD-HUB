import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/**
 * DB Baseline Audit
 * This script checks for indexed vs collection scans.
 */
async function auditDB() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI.split("@")[1]); // hide credentials
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected\n");

    const collections = ["items", "orders", "shops", "users"];
    
    for (const collName of collections) {
      const coll = mongoose.connection.db.collection(collName);
      const indexes = await coll.indexes();
      console.log(`--- Collection: ${collName} ---`);
      console.log(`Current Indexes:`, indexes.map(i => i.name).join(", "));

      // Test a typical query: getItemByCity
      // Test the real getItemByCity query: items by shop array
      if (collName === "items") {
        console.log("\nTesting 'getItemByCity' → item lookup query plan...");
        // First get a real shop id from the db
        const shop = await mongoose.connection.db.collection('shops').findOne({});
        if (shop) {
          const explain = await coll.find({ shop: shop._id }).explain("executionStats");
          const stage = explain.executionStats.executionStages.stage
            || explain.executionStats.executionStages.inputStage?.stage;
          const docsExamined = explain.executionStats.totalDocsExamined;
          const docsReturned = explain.executionStats.nReturned;
          console.log(`Result: ${stage}`);
          console.log(`Docs Examined: ${docsExamined}`);
          console.log(`Docs Returned: ${docsReturned}`);
          if (stage === "COLLSCAN") {
            console.log("❌ WARNING: Still doing a full collection scan.");
          } else {
            console.log("✅ OK: Index used — IXSCAN confirmed.");
          }
        } else {
          console.log("No shops found — skipping items explain.");
        }
      }
      
      console.log("\n");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

auditDB();
