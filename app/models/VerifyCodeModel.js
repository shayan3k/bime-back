module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      phone_number: {
        type: String,
        default: "",
        length: 11,
      },
      email: {
        type: String,
        default: "",
      },
      code: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const VerifyCode = mongoose.model("verify-code", schema);
  return VerifyCode;
};
