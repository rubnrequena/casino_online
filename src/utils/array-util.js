/**
 *
 * @param {Array} data
 * @param {String} campo
 * @param {String} nombre
 * @param {String} campoHijo
 * @returns {Array}
 */
function agruparArrayObj(data, campo, nombre, campoHijo = "hijos") {
  return data.reduce((acc, el) => {
    let item = acc.find((i) => i._id == el[campo]);
    if (item) item[campoHijo].push(el);
    else {
      item = { _id: el[campo] };
      item[nombre] = el[campo];
      item[campoHijo] = [el];
      acc.push(item);
    }
    return acc;
  }, []);
}

module.exports = {
  agruparArrayObj,
};
