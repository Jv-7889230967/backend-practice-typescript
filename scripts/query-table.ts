import prisma from "../src/DB/prisma-client";


async function queryTable(tableName: string) {
  try {
    // Validate table name exists
    const validTables = ['user']; // Add all your model names here (lowercase)
    
    if (!validTables.includes(tableName.toLowerCase())) {
      console.error(`❌ Invalid table name: ${tableName}`);
      console.log(`✅ Valid tables: ${validTables.join(', ')}`);
      process.exit(1);
    }

    // Query the table dynamically
    const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase();
    
    // @ts-ignore - Dynamic model access
    const data = await prisma[tableName.toLowerCase()].findMany();

    if (data.length === 0) {
      console.log(`📭 No records found in table: ${tableName}`);
    } else {
      console.log(`📊 Found ${data.length} records in table: ${tableName}`);
      console.log('');
      console.table(data);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error querying table:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Get table name from command line argument
const tableName = process.argv[2];

if (!tableName) {
  console.error('❌ Please provide a table name');
  console.log('Usage: npm run query-table <table-name>');
  console.log('Example: npm run query-table user');
  process.exit(1);
}

queryTable(tableName);