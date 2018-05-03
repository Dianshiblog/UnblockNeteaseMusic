import 'colors';
import { Utils, Netease } from '../../utils';
import { handleDeadMusic, checkPairMusic } from './dead';

const utils = new Utils();

export const download = async (ctx, next) => {
  const data = ctx.body;

  if (Netease.getDownloadReturnCode(data) === 200) {
    return console.log('The song URL is '.green + data.data.url);
  }

  const songId = Netease.getDownloadSongId(data);
  let pair;
  try {
    pair = await checkPairMusic(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  if (pair) {
    try {
      data.data = await Netease.modifyPlayerApiCustom(pair, data.data);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    let songInfo;
    try {
      songInfo = await Utils.getSongInfo(songId);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
    let urlInfo;
    try {
      urlInfo = await utils.getUrlInfo(songInfo);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
    if (urlInfo) {
      try {
        data.data = await Netease.modifyDownloadApiCustom(urlInfo, data.data);
      } catch (error) {
        console.log('No resource.'.red);
        throw new Error(error);
      }
    } else {
      console.log('No resource.'.red);
      handleDeadMusic(songId, songInfo);
    }
  }

  ctx.body = JSON.stringify(data);
  return next();
};

export default download;
