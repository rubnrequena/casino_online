const { mapActions } = require("vuex");

module.exports = {
  data() {
    return {
      usuario: null,
      comisiones: [],
      cargando: [],
      nuevaComision: false,
      comision: {
        operadora: null,
        comision: 0,
        participacion: 0,
        utilidad: 0
      }
    }
  },
  computed: {
    esPOS() {
      if (!this.usuario) return false
      return this.usuario.rol.match(/taquilla|online/)
    }
  },
  methods: {
    ...mapActions('usuario', {
      comision_usuario: 'comision_usuario',
      comision_editar: 'comision_editar',
      comision_nueva: 'comision_nueva'
    }),
    onUsuario_change() {
      this.comision_usuario(this.usuario._id).then(comisiones => {
        this.comisiones = comisiones
      })
    },
    actualizar(comision, indice) {
      this.cargando[indice] = true
      this.cargando = [...this.cargando]
      this.comision_editar({
        usuario: this.usuario._id,
        comision
      }).then(() => {
        this.$toasted.success('Comision modificada exitosamente 👍', { duration: 3000 })
      }).catch(error => {
        this.$toasted.error(error, { duration: 3000 })
      }).finally(() => {
        this.cargando[indice] = false
        this.cargando = [...this.cargando]
      })
    },
    onNuevaComision() {
      this.nuevaComision = true;
    },
    onRegistrar() {
      let comision = {
        ...this.comision,
        usuario: this.usuario._id
      }
      this.comision_nueva(comision).then(() => {
        this.onUsuario_change()
        this.$toasted.success('Comision registrada exitosamente', { duration: 5000 })
      }).catch(error => {
        this.$toasted.error(error, { duration: 5000 })
      })
    }
  },
};
