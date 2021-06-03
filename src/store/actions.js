import {
  ADD_COUNTER,
  ADD_TO_CART,
} from './mutation-types'

export default {
  addCart({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      // 1.查找之前数组中是否有该商品
      let oldProduct = state.cartList.find(function (item) {
        return item.iid === payload.iid
      })
      // 2.判断oldProduct
      if (oldProduct) { // 数量加1
        // oldProduct.count += 1;
        commit(ADD_COUNTER, oldProduct)
        resolve("数量加1")
      } else { // 添加新的商品
        payload.count = 1;
        // state.cartList.push(payload)
        commit(ADD_TO_CART, payload)
        resolve("添加新的商品")
      }
    })
  }
}