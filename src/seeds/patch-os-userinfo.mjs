import os from "node:os";

const realUserInfo = os.userInfo.bind(os);

os.userInfo = (options) => {
  try {
    return realUserInfo(options);
  } catch (error) {
    if (error?.code !== "ERR_SYSTEM_ERROR") {
      throw error;
    }

    return {
      gid: -1,
      homedir: process.env.USERPROFILE || process.cwd(),
      shell: null,
      uid: -1,
      username: process.env.USERNAME || "local-user",
    };
  }
};
