import { formatMoney } from "../../utils/number";

Component({
  props: {
    className: "",
    price: 0,
  },
  data: {
    number: 0,
  },
  format(value) {
    this.setData({ number: formatMoney(value) });
  },
  didMount() {
    this.format(this.props.price);
  },
  didUpdate(prevProps) {
    if (prevProps.price !== this.props.price) {
      this.format(this.props.price);
    }
  },
});
