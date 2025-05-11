import { ProductRepository } from "../infra/database/mysql/repository/ProductRepository";

export class CreateProductService {
  private database: ProductRepository;

  constructor(database: ProductRepository) {
    this.database = database;
  }

  async execute() {
    const data: any = [
      { name: "Notebook", price: 4500.0, quantity: 10 },
      { name: "Mouse", price: 50.0, quantity: 100 },
      { name: "Teclado", price: 120.0, quantity: 80 },
      { name: "Monitor", price: 950.0, quantity: 25 },
      { name: "Headset", price: 300.0, quantity: 60 },
      { name: "Cadeira Gamer", price: 1100.0, quantity: 15 },
      { name: "Cadeira ", price: 1100.0, quantity: 15 },
      { name: "Mesa", price: 500.0, quantity: 20 },
      { name: "Placa de Vídeo", price: 2000.0, quantity: 5 },
      { name: "Placa Mãe", price: 800.0, quantity: 10 },
      { name: "Processador", price: 1500.0, quantity: 8 },
      { name: "Memória RAM", price: 400.0, quantity: 50 },
      { name: "Fonte", price: 300.0, quantity: 30 },
      { name: "HD Interno", price: 250.0, quantity: 40 },
      { name: "SSD", price: 600.0, quantity: 20 },
      { name: "Caixa de Som", price: 200.0, quantity: 70 },
      { name: "Webcam", price: 200.0, quantity: 40 },
      { name: "Pen Drive 64GB", price: 45.0, quantity: 150 },
      { name: "Pen Drive 128GB", price: 80.0, quantity: 120 },
      { name: "Fone de Ouvido", price: 100.0, quantity: 90 },
      { name: "Carregador", price: 50.0, quantity: 200 },
      { name: "Cabo HDMI", price: 30.0, quantity: 250 },
      { name: "Cabo USB", price: 20.0, quantity: 300 },
      { name: "Adaptador USB-C", price: 40.0, quantity: 150 },
      { name: "Teclado Mecânico", price: 250.0, quantity: 30 },
      { name: "Mouse Gamer", price: 150.0, quantity: 40 },
      { name: "Mousepad", price: 30.0, quantity: 100 },
      { name: "Suporte para Monitor", price: 80.0, quantity: 25 },
      { name: "Suporte para Teclado", price: 60.0, quantity: 20 },
      { name: "Suporte para Headset", price: 40.0, quantity: 50 },
      { name: "Estabilizador", price: 200.0, quantity: 15 },
      { name: "Nobreak", price: 600.0, quantity: 10 },
      { name: "Extensão Elétrica", price: 50.0, quantity: 80 },
      { name: "Adaptador de Tomada", price: 20.0, quantity: 200 },
      { name: "HD Externo 1TB", price: 320.0, quantity: 30 },
      { name: "Smartphone", price: 2500.0, quantity: 20 },
      { name: "Tablet", price: 1800.0, quantity: 18 },
      { name: "Impressora", price: 800.0, quantity: 12 },
      { name: "Scanner", price: 600.0, quantity: 10 },
      { name: "Switch de Rede", price: 350.0, quantity: 22 },
      { name: "Roteador Wi-Fi", price: 280.0, quantity: 35 },
      { name: "Carregador USB-C", price: 65.0, quantity: 90 },
      { name: "Hub USB", price: 75.0, quantity: 55 },
      { name: "Microfone", price: 150.0, quantity: 45 },
      { name: "Controle Bluetooth", price: 180.0, quantity: 38 },
      { name: "Projetor", price: 2200.0, quantity: 8 },
    ];

    const promises = [];

    for (const product of data) {
      promises.push(
        this.database.create({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })
      );
    }

    await Promise.all(promises);
  }
}
