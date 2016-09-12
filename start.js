const config = require('./config');
const jsforce = require('jsforce');
var documentClient = require("documentdb").DocumentClient;
const conn = new jsforce.Connection();
const url=require("url");
const client = new documentClient(config.endpoint, { "masterKey": config.primarykey });
const databaseUrl = `dbs/${config.database}`;

let tables = config.tables;

conn.login(config.sfUsername, config.sfPassword+config.sfSecurityToken, (err, res) => {
  if (err) { return console.error(err); }
  tables.map(schema);
});

function schema(table_name) {
  return (conn.sobject(table_name).describe((err, meta) => {
    if (err) { return console.error(err); }
    let len=meta.fields.length;
    let records = [];
    let str = "";
    let A = [];
    for(let i=0;i<len;i++) {
      if(meta.fields[i].name!="ID") {
        records[i] = meta.fields[i].name;
      }
    }
    str = records.join();
    conn.query("SELECT " + str + " from "+table_name)
    .on('record', function(rec) {
      delete rec.attributes
      A.push(rec);
      })
    .on('error', function(err) {
      console.log(err);
    }).on('end',function() {
      let collection_name = table_name; // this must be table_name and table_name = collection.id
      let collectionUrl = `${databaseUrl}/colls/${collection_name}`;
      for(let i=0;i<A.length;i++) {
        client.createDocument(collectionUrl, A[i], (err, created) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log("created");
          }
        });
      }
    })
  }));
}
