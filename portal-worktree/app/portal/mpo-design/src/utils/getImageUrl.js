export let ImagePath;

(function (ImagePath) {
  ImagePath['LANDING'] = 'landing';
  ImagePath['USERS'] = 'users';
  ImagePath['ECOMMERCE'] = 'e-commerce';
  ImagePath['PROFILE'] = 'profile';
  ImagePath['CLIENTS'] = 'clients';
  ImagePath['CHANGELOG'] = 'change-log';
  ImagePath['WORKSPACE'] = 'workspace';
})(ImagePath || (ImagePath = {}));

// ==============================|| NEW URL - GET IMAGE URL ||============================== //

export function getImageUrl(name, path) {
  const resolvedName = name.replace(/mphone[12]/, 'default');
  return new URL(`/src/assets/images/${path}/${resolvedName}`, import.meta.url).href;
}
