const fs = require('fs');
const path = require('path');
const SiteContent = require('../models/SiteContent');

const CONTENT_STORE_PATH = path.join(__dirname, '../data/site_content.json');

const ensureDataDir = () => {
  const dir = path.dirname(CONTENT_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getLocalContent = () => {
  ensureDataDir();
  if (fs.existsSync(CONTENT_STORE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONTENT_STORE_PATH, 'utf8'));
    } catch (e) {
      console.error('Error reading local content store:', e);
    }
  }
  return [];
};

const saveLocalContent = (items) => {
  ensureDataDir();
  try {
    fs.writeFileSync(CONTENT_STORE_PATH, JSON.stringify(items, null, 2));
  } catch (e) {
    console.error('Error saving local content store:', e);
  }
};

const getAllContent = async () => {
  try {
    const dbContent = await SiteContent.find({}).lean().exec();
    if (dbContent && dbContent.length > 0) {
      saveLocalContent(dbContent);
      return dbContent;
    }
  } catch (err) {
    console.log('ℹ️ MongoDB unavailable for content, using local content store');
  }
  return getLocalContent();
};

const updateContentItem = async (section, key, value, label, fieldType) => {
  let updatedItem = { section, key, value, label, fieldType, updatedAt: new Date().toISOString() };
  
  try {
    const doc = await SiteContent.findOneAndUpdate(
      { section, key },
      { value, ...(label && { label }), ...(fieldType && { fieldType }) },
      { new: true, upsert: true, runValidators: true }
    ).lean().exec();
    if (doc) updatedItem = doc;
  } catch (err) {
    console.log('ℹ️ Saving content item to local store');
  }

  const items = getLocalContent();
  const index = items.findIndex(i => i.section === section && i.key === key);
  if (index >= 0) {
    items[index] = { ...items[index], ...updatedItem };
  } else {
    items.push(updatedItem);
  }
  saveLocalContent(items);
  return updatedItem;
};

module.exports = {
  getAllContent,
  updateContentItem,
  getLocalContent,
  saveLocalContent
};
