document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Ayam Geprrek",
        img: "1.jpeg",
        price: 10000,
        description:
          "Ayam geprek nan pedas dan nikmat,dengan kulit super kriuk,enak disantap kapanpun bersama es teh jumbo",
      },
      {
        id: 2,
        name: "Ayam Racik Pedas Nikmat",
        img: "2.jpeg",
        price: 12000,
        description: "Ayam yang diracik kecil dengan sambal super nikmat",
      },
      {
        id: 3,
        name: "Es Pisang Coklat",
        img: "3.jpeg",
        price: 8000,
        description:
          "Es yang terbuat dari pisang yang di bekukan,di lumuri dengan coklat cair,enak di makan saat cuaca panas",
      },
      {
        id: 4,
        name: "Teh Es Mini",
        img: "4.jpeg",
        price: 3000,
        description: "Es teh manis dingin, penghilang haus saat cuaca panas",
      },
      {
        id: 5,
        name: "Teh Es Jumbo",
        img: "5.jpeg",
        price: 5000,
        description:
          "Teh manis dengan es batu super dingin,untuk penghilang dahaga saat cuaca super panas",
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah barang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });

  Alpine.store("modal", {
    open(id) {
      const modal = document.querySelectorAll(".modal");
      modal[id - 1].classList.add("active");
    },

    close() {
      const activeModals = document.querySelectorAll(".modal.active");
      if (activeModals.length > 0) {
        activeModals.forEach((modal) => modal.classList.remove("active"));
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkoutButton");
checkoutButton.disabled = true;

const checkoutForm = document.querySelector("#checkoutForm");
checkoutForm.addEventListener("keyup", function () {
  for (let i = 0; i < checkoutForm.elements.length - 1; i++) {
    if (checkoutForm.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol heckout di klik
checkoutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // console.log(objData);
  const message = formatMessage(objData);

  window.open('https://wa.me/+6282386566025?text=' + encodeURIComponent(message));
});

const formatMessage = (obj) => {
  return `Data Customer
    Nama     : ${obj.name}
    Alamat   : ${obj.alamat}
    No. Telp : ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${Rupiah(item.total)}) \n`
    )}
    TOTAL BAYAR : ${Rupiah(obj.total)}
    Terima Kasih.`;
};

// konversi ke rupiah
const Rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
