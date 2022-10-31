import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class OrdersEntity {

    @PrimaryColumn()
    public Pedido: string;

    @Column()
    public MetodoPago: string;

    @Column()
    public Tienda: string;

    @Column()
    public MetodoEnvio: string;

    @Column()
    public Cliente: string;

    @Column()
    public Vitrina: string;

    @Column()
    public FechaCreacion: Date;

    @Column()
    public FechaModificacion: Date;

}