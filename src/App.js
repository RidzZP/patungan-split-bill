import { useState } from "react";

// dummu data
const initialFriends = [
  {
    id: 118836,
    name: "Ridwan",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Fahmi",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anton",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  // local state untuk menampung data baru
  const [items, setItems] = useState(initialFriends);

  // toggle form tambah
  const [toggleTambah, setToggleTambah] = useState(false);

  // toggle form patungan
  const [selected, setSelected] = useState(null);

  // handle formTambah untuk menampilkan dan menghilangkan form
  function handleToggle() {
    setToggleTambah((toggleTambah) => !toggleTambah);
  }

  // menambahkan item baru seperti biasa parameter(item) didapat dari props yang dikirimkan ke FormTambahTeman pada handleSubmit
  function handleTambah(item) {
    setItems((items) => [...items, item]);
  }

  function handleSelection(item) {
    // setSelected(item);
    setSelected((cur) => (cur?.id === item.id ? null : item));
    setToggleTambah(false);
  }

  // handle update data nilai balance
  function handlePatungan(value) {
    setItems((items) =>
      items.map((item) =>
        item.id === selected.id
          ? { ...item, balance: item.balance + value }
          : item
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* mengirimkan props items sebagai new data untuk menggantikan dummyData*/}
        <FriendList
          newData={items}
          onSelection={handleSelection}
          selected={selected}
        />

        {/* pengkondisian toggle formTambah*/}
        {toggleTambah && <FormTambahTeman onTambah={handleTambah} />}
        <Button onClick={handleToggle}>
          {/* pengkondisian value button */}
          {toggleTambah === true ? "Close" : "Tambah Teman"}
        </Button>
      </div>

      {/* pengkondisian toggle formPatungan */}
      {selected && (
        <FormPatungan selected={selected} onPatungan={handlePatungan} />
      )}
    </div>
  );
}

const FriendList = ({ newData, onSelection, selected }) => {
  const data = newData;
  return (
    <ul>
      {data.map((data) => (
        <List
          dataObj={data}
          key={data.id}
          onSelection={onSelection}
          selected={selected}
        />
      ))}
    </ul>
  );
};

const List = ({ dataObj, onSelection, selected }) => {
  // mengambil data berdasarkan id
  const isSelected = selected?.id === dataObj.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={dataObj.image} alt={dataObj.name} />
      <h3>{dataObj.name}</h3>

      {/* kondisi deskripsi tagihan */}
      {dataObj.balance < 0 && (
        <p className="red">
          Hutang Aku Ke {dataObj.name} Rp.
          {Math.abs(dataObj.balance.toLocaleString("id-ID"))}
        </p>
      )}
      {dataObj.balance > 0 && (
        <p className="green">
          Hutang {dataObj.name} Ke Aku Rp.{Math.abs(dataObj.balance)}
        </p>
      )}
      {dataObj.balance === 0 && <p>Nggak ada</p>}

      <Button onClick={() => onSelection(dataObj)}>
        {/* kondisi value button */}
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({ onClick, children }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const FormTambahTeman = ({ onTambah }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    // menggunakan e.preventDefault agar tidak refresh saat onSubmit
    e.preventDefault();

    // deklarasi nilai state yang akan ditambahkan
    const id = crypto.randomUUID;
    const newData = { id, name, image: `${image}?=${id}`, balance: 0 };

    // jika kondisi tidak terpenuhi maka kembalikan kosong/tidak melakukan apa apa
    if (!name && !image) return;

    console.log(newData);

    // mengirimkan nilai state ke penampung state baru(items) lewat props newData
    onTambah(newData);

    // set nilai state seperti semula ketika data berhasil disimpan
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🫂Nama</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷Link Foto</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Tambah</Button>
    </form>
  );
};

const FormPatungan = ({ selected, onPatungan }) => {
  const [tagihan, setTagihan] = useState("");
  const [payByUser, setPayByUser] = useState("");
  const payByFriend = tagihan ? tagihan - payByUser : "";
  const [siapaBayar, setSiapaBayar] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!tagihan || !payByUser) return;
    onPatungan(siapaBayar === "user" ? payByFriend : -payByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Patungan Bersama {selected.name}</h2>

      <label>💰Jumlah Tagihan</label>
      <input
        type="text"
        value={`Rp ${tagihan.toLocaleString("id-ID")}`}
        onChange={(e) => {
          const formattedValue = e.target.value.replace(/\D/g, "");
          setTagihan(Number(formattedValue));
        }}
      />

      <label>💰Tagihan Aku</label>
      <input
        type="text"
        value={`Rp ${payByUser.toLocaleString("id-ID")}`}
        onChange={(e) => {
          const formattedValue = e.target.value.replace(/\D/g, "");
          setPayByUser(
            Number(formattedValue) > tagihan
              ? payByUser
              : Number(formattedValue)
          );
        }}
      />

      <label>💰Tagihan {selected.name}</label>
      <input
        type="text"
        disabled
        value={`Rp ${payByFriend.toLocaleString("id-ID")}`}
      />

      <label>💰Mau Dibayarin Siapa?</label>
      <select
        value={siapaBayar}
        onChange={(e) => setSiapaBayar(e.target.value)}
      >
        <option value="user">Aku</option>
        <option value="teman">{selected.name}</option>
      </select>

      <Button>Patungan</Button>
    </form>
  );
};
