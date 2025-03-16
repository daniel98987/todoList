import { BaseTarea } from "./baseTarea.interface";
import { SubTarea } from "./subTarea.interface";

export interface Tarea extends BaseTarea {
    category:string,
    subTareas?:SubTarea[]
}
