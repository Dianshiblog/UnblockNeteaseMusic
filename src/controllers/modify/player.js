import 'colors';
import { Utils, Netease } from '../../utils';
import { handleDeadMusic, checkPairMusic } from './dead';

const utils = new Utils();

export const player = async (ctx, next) => {
  const data = ctx.body;

  const playbackReturnCode = data.data[0].code;
  const songId = data.data[0].id;

  if (playbackReturnCode === 200) {
    console.log('The song URL is '.green + data.data[0].url);
    return next();
  }

  let pair;
  try {
    pair = await checkPairMusic(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  if (pair) {
    try {
      data.data[0] = await Netease.modifyPlayerApiCustom(pair, data.data[0]);
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
        data.data[0] = await Netease.modifyPlayerApiCustom(urlInfo, data.data[0]);
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

export default player;
