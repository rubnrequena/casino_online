const { mapActions } = require("vuex");

module.exports = {
  data() {
    return {
      serial: '',
      ticket: null,
      operadoras: [],
      sorteos: [],
      premios: 0,
      anularDialog: false
    }
  },
  methods: {
    ...mapActions('ticket', {
      buscar: 'buscar_serial',
      anular: 'anular_ticket'
    }),
    onBuscar() {
      this.buscar(this.serial).then(ticket => {
        this.ticket = ticket
        this.operadoras = this.ticket.ventas.reduce((acc, venta) => {
          const sorteo = ticket.sorteos.find(_sorteo => _sorteo._id == venta.sorteo)
          const operadora = ticket.operadoras.find(_op => _op._id == sorteo.operadora)
          if (venta.premio) {
            venta.premioMonto = venta.monto * operadora.paga
          } else {
            venta.premioMonto = 0
          }
          if (operadora) {
            const monto = acc[operadora._id]
            acc[operadora._id] = monto ? monto + venta.monto : venta.monto
          }
          return acc
        }, {})
        this.sorteos = this.ticket.ventas.reduce((acc, venta) => {
          const sorteo = ticket.sorteos.find(_sorteo => _sorteo._id == venta.sorteo)
          if (sorteo) {
            const monto = acc[sorteo._id]
            acc[sorteo._id] = monto ? monto + venta.monto : venta.monto
          }
          return acc
        }, {})
        this.premios = this.ticket.ventas.reduce((total, venta) => {
          return total + venta.premioMonto
        }, 0)
      })
    },
    onAnular() {
      this.anular(this.ticket.serial).then(() => {
        this.$toasted.success("Ticket anulado exitosamente", { duration: 3000 })
        this.onBuscar()
      }).catch(error => this.$toasted.error(error, { duration: 3000 }))
    },
    buscarOperadora(operadora) {
      return this.ticket.operadoras.find(op => {
        return op._id == operadora
      })
    },
    buscarSorteo(sorteo) {
      return this.ticket.sorteos.find(_sorteo => {
        return _sorteo._id == sorteo
      })
    }
  },
};
