-- sql/stored_procedures.sql

-- Procedimientos almacenados para reportes de reservas

DELIMITER //

-- Estadísticas de reservas por rango de fechas
CREATE PROCEDURE get_reservas_stats(
    IN inicio DATE,
    IN fin DATE
)
BEGIN
    SELECT 
        COUNT(*) AS total_reservas,
        SUM(COALESCE(importe_total, 0)) AS total_ingresos,
        AVG(COALESCE(importe_total, 0)) AS promedio_ingresos,
        MIN(fecha_reserva) AS primera_reserva,
        MAX(fecha_reserva) AS ultima_reserva
    FROM reservas
    WHERE fecha_reserva BETWEEN inicio AND fin
    AND activo = 1;
END //

-- Reservas agrupadas por salón
CREATE PROCEDURE get_reservas_por_salon(
    IN inicio DATE,
    IN fin DATE
)
BEGIN
    SELECT 
        s.salon_id,
        s.titulo AS salon_nombre,
        COUNT(r.reserva_id) AS cantidad_reservas,
        SUM(COALESCE(r.importe_total, 0)) AS total_ingresos
    FROM salones s
    LEFT JOIN reservas r ON s.salon_id = r.salon_id 
        AND r.fecha_reserva BETWEEN inicio AND fin
        AND r.activo = 1
    WHERE s.activo = 1
    GROUP BY s.salon_id, s.titulo
    ORDER BY cantidad_reservas DESC;
END //

-- Reservas agrupadas por fecha
CREATE PROCEDURE get_reservas_por_fecha(
    IN inicio DATE,
    IN fin DATE
)
BEGIN
    SELECT 
        fecha_reserva,
        COUNT(*) AS cantidad_reservas,
        SUM(COALESCE(importe_total, 0)) AS total_ingresos
    FROM reservas
    WHERE fecha_reserva BETWEEN inicio AND fin
    AND activo = 1
    GROUP BY fecha_reserva
    ORDER BY fecha_reserva DESC;
END //

DELIMITER ;

