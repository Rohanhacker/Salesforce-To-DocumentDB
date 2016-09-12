let config = {}

// You should have collections created in
// documentdb with names which are similar
// to your salesforce table names

config.endpoint = "Document DB end point";
config.database = "Your documentdb database name";
config.primarykey = "primary key docdb";
config.tables = []; // enter names of sf tables for eg-> ["account,"contact"]
config.sfUsername = "salesforce username";
config.sfPassword = "Your Password";
config.sfSecurityToken = "salesforce security token";

module.exports = config;
