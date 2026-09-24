<?php

namespace App;

enum StockMovementType: string
{
    case Entry = 'Entrada';
    case Exit = 'Saída';
}
