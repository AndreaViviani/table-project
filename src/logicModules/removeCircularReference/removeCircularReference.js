function removeCircularReference(data, cols) {
  const keys = cols.map((col) => {
      return col.id;
    })
    let dataToSave = [];
    console.log(dataToSave);
    for (let i = 0; i < data.length; i++) {
      dataToSave.push(data[i]);
    }
    for (let i = 0; i < data.length; i++) {
      let newRow = {};
      console.log(dataToSave[i]);
      for (const cell of keys) {
        if (typeof data[i][cell] !== 'string' || data[i][cell] instanceof String) {
          newRow[cell] = "";
          console.log(typeof(data[i][cell]));
        } else {
          newRow[cell] = data[i][cell];
        }
      }
      dataToSave[i] = newRow;
    }
    console.log(dataToSave);
    return dataToSave;
  }

export default removeCircularReference;