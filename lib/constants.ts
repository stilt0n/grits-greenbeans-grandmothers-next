export const images = {
  grits:
    'https://images.unsplash.com/photo-1559852925-6a5a7125525b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  greenbeans:
    'https://images.unsplash.com/photo-1448293065296-c7e2e5b76ae9?q=80&w=2014&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  pizza:
    'https://grits-greenbeans-and-grandmothers.s3.us-east-005.backblazeb2.com/test_image_pizza.png',
  default:
    'https://grits-greenbeans-and-grandmothers.s3.us-east-005.backblazeb2.com/images/default_recipe_image_00.png',
};

export const FAMILY_TREE_LINK = process.env.family_tree_link ?? '';

export const IMAGE_BASE_URL =
  'https://grits-greenbeans-and-grandmothers.s3.us-east-005.backblazeb2.com';

export const blurDataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0W7q0HgAEmgIB3KULHAAAAABJRU5ErkJggg==';

const hash = Date.now().toString();

export const robohash = `https://robohash.org/${hash}?set=set3`;
