const { mapActions } = require("vuex");

module.exports = {
  data() {
    return {
      usuario: null,
      comisiones: []
    }
  },
  methods: {
    ...mapActions('usuario', {
      comision_usuario: 'comision_usuario',
      comision_editar: 'comision_editar'
    }),
    onUsuario_change(usuario) {
      this.comision_usuario(usuario._id).then(comisiones => {
        this.comisiones = comisiones
      })
    },
    actualizar(comision) {
      this.comision_editar({
        usuario: this.usuario._id,
        comision
      }).then(() => {
        this.$toasted.success('Comision modificada exitosamente 👍', { duration: 3000 })
      }).catch(error => {
        this.$toasted.error(error, { duration: 3000 })
      })
    }
  },
};
