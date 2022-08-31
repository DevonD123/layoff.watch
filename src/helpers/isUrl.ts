const isUrl = (url: string) => {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)?[A-Za-z0-9.-]+|[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
    url
  );
};

export default isUrl;
