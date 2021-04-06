function normalData(data) {
  // 处理数据
  console.log('获取的原始数据',data);  //请求得到的数据(原始数据)
  let obj = {'热门':[]};
  // let obj = {hot:[]};
  // 按照首字母进行分组
  for (let index = 0; index < data.length; index++) {
    // console.log('#####',data[index])
    // 获取每一项数据中我们需要的数据(解构方式),通常命名与获取到的数据的键一致
    let {Findex,Fother_name,Fsinger_mid,Fsinger_name,Fsinger_id} = data[index];
    // 头像src地址
    let avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${Fsinger_mid}.jpg?max_age=2592000`;
    let singerItem = {Findex,Fother_name,Fsinger_mid,Fsinger_name,Fsinger_id,avator};
    // console.log(Findex);   // 打印每一项中的首字母
    // 将前10条数据加入到最热内部
    if (index < 10) {
      // obj.hot.push(singerItem)
      obj['热门'].push(singerItem)
    }
    if (!obj[Findex]) { // 如果不存在
      // 没有，进行新建下标操作
      obj[Findex] = [singerItem]
    } else {
      // 有，进行添加操作 向首字母里添加歌手
      obj[Findex].push(singerItem)
    }
  }
  // 将对象转变为数组  我们要的数据格式
  let hot = [];
  let others = [];
  for (const key in obj) {
    if (key === '热门') {
      hot.push({Findex: key,list: obj[key]
      })
    } else if (key != '9') {
      others.push({Findex: key,list: obj[key]
      })
    }
  }
  // 按照下标进行排序,返回ASCII码值从小到大排序  转数组的目的就是为了排序
  let rank = others.sort((a, b) => {
    // a/b为每一项的数据
    return a.Findex.charCodeAt() - b.Findex.charCodeAt()
  });
  // 合并操作 将hot和others合并成一个新的数组
  let result = hot.concat(others);
  return result  // result为处理完毕后的数据
}

export {normalData}
