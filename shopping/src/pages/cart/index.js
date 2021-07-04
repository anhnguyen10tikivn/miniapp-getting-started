import { post } from "../../services/api";
import { getQuotes } from "../../services/shipping";
import { getRecentAddress, setRecentAddress } from "../../utils/storage";

const app = getApp();

const API_URL = "https://miniapp-demo.tala.xyz";

Page({
  data: {
    cart: app.cart,
    address: null,
    quotes: [],
    quote: null,
  },
  async onLoad() {
    this.setData({ cart: app.cart });

    // Init address
    await this.initAddress();
    // Init quotes
    this.getListQuotes();
  },
  async initAddress() {
    const recentAddress = await getRecentAddress();
    if (recentAddress) {
      this.setData({ address: recentAddress });
    }
  },
  async getListQuotes() {
    const { address, cart } = this.data;
    if (address && cart.products.length) {
      const rs = await getQuotes(address, cart.products);
      const quotes = (rs && rs.quotes) || [];
      const sorted = quotes.sort((a, b) => a.fee.amount - b.fee.amount);
      console.log("sorted :>> ", sorted[0]);
      this.setData({ quotes, quote: sorted[0] });
    }
  },
  onChangeAddress(address) {
    this.setData({ address }, () => this.getListQuotes());
    setRecentAddress(address);
  },
  onChangeQuote() {},
  async doPayment() {
    const data = {
      order: {
        items: app.cart.products.map((item) => ({
          name: item.name,
          img_url: item.thumbnail_url,
          // description: item.description || "",
          description: "",
          quantity: item.total,
          price: item.price,
          weight: 1,
          height: Math.floor(Math.random() * 100),
          width: Math.floor(Math.random() * 100),
          depth: Math.floor(Math.random() * 100),
        })),
        shipping: 14000,
        shipping_address: {
          name: "Hung Nguyen",
          phone: "0987654321",
          street:
            "Toa nhà Viettel Complex, 285 CMT8, Phường 12, Quận 10, Hồ Chí Minh",
        },
        shipping_info: {
          partner_code: "GRAB",
          service_code: "INSTANT",
        },
        sub_total: 63800,
        total: 77800,
      },
    };
    console.log("data :>> ", data);
    // const res = await post("https://miniapp-demo.tala.xyz/orders", {

    const res = await post(`${API_URL}/orders`, {
      token: this.data.app.authToken,
      data,
    });
    console.log("res", res);

    try {
      my.makePayment({
        orderId: res.data.order.tiki_ref_id,
        fail: (err) => {
          console.log("make payment fail", err);
        },
      });
      // await my.alert({
      //   title: "Thanh toán thành công",
      //   content: `Bạn đã thanh toán ${this.data.order.total} ₫`,
      // });
      // my.navigateTo({
      //   url: "pages/index/index",
      // });
    } catch (error) {
      console.log("order error", error);
      my.alert({
        title: "Thanh toán thất bại",
        content: `Vui lòng thử lại`,
        buttonText: `Thử lại`,
      });
    }
  },
});
