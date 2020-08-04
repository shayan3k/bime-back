module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: {
        type: String,
        default: "",
      },
      lastname: {
        type: String,
        default: "",
      },
      phone_number: {
        type: String,
        default: null,
        unique: true,
      },
      email: {
        type: String,
        default: null,
        unique: true,
      },
      role: {
        type: String,
        default: "user",
      },
      balance: {
        type: Number,
        default: 0,
      },
      image: {
        type: String,
        default: "default.png",
      },
      is_active: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
