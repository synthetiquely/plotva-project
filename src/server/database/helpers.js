const { ObjectId } = require('mongodb');

async function pageableCollection(
  collection,
  { lastId, order, limit = 10, ...query } = {},
) {
  let count = await collection.find(query).count();

  if (lastId) {
    query._id = {
      $gt: ObjectId(lastId.toString()),
    };
  }

  let queryBuilder = collection.find(query, { limit });

  if (typeof query._id === 'string') {
    query._id = ObjectId(query._id.toString());
  }

  let cursor = await queryBuilder;
  let items = await cursor.toArray();
  let next = null;

  if (items.length === limit) {
    next = {
      limit,
      order,
      lastId: items[items.length - 1]._id,
      ...query,
    };
  }

  return {
    count,
    items,
    next,
  };
}

async function insertOrUpdateEntity(collection, data) {
  if (data._id) {
    await collection.findOneAndUpdate(
      { _id: ObjectId(data._id.toString()) },
      data,
      { returnNewDocument: true },
    );
  } else {
    let result = await collection.insertOne(data);
    data._id = result.insertedId;
  }
  return collection.findOne({ _id: ObjectId(data._id.toString()) });
}

module.exports = {
  pageableCollection,
  insertOrUpdateEntity,
};
