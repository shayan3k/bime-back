module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      transaction_id: {
        type: String,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      authority: {
        type: String,
        required: true,
      },
      pid: {
        type: String,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Peyment = mongoose.model("peyment", schema);
  return Peyment;
};
