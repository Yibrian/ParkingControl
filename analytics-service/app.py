from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


db_config_1 = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'parking_spaces'
}

db_config_2 = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'parking_control'
}

def get_db1_connection():
    return mysql.connector.connect(**db_config_1)

def get_db2_connection():
    return mysql.connector.connect(**db_config_2)

@app.route('/api/analytics/summary')
def analytics_summary():
    conn = get_db1_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM reservations")
    total_reservas = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(price_per_hour) FROM spaces")
    ingresos = cursor.fetchone()[0] or 0

    # Ocupación semanal (ejemplo: reservas por día de la semana)
    cursor.execute("""
        SELECT DAYOFWEEK(start_date) as dia, COUNT(*) 
        FROM reservations 
        GROUP BY dia
        ORDER BY dia
    """)
    ocupacion = [0]*7
    for dia, count in cursor.fetchall():
        ocupacion[dia-1] = count

    cursor.close()
    conn.close()

    data = {
        "total_reservas": total_reservas,
        "ingresos": ingresos,
        "ocupacion": ocupacion
    }
    return jsonify(data)

@app.route('/api/analytics/reservas-por-dia')
def reservas_por_dia():
    conn = get_db1_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DATE(start_date) as fecha, COUNT(*) 
        FROM reservations 
        GROUP BY fecha
        ORDER BY fecha
    """)
    resultados = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {
        "labels": [fila[0].strftime('%Y-%m-%d') for fila in resultados],
        "values": [fila[1] for fila in resultados]
    }
    return jsonify(data)

@app.route('/api/analytics/ingresos-mes')
def ingresos_mes():
    conn = get_db1_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT MONTHNAME(start_date) as mes, SUM(price_per_hour) 
        FROM reservations r
        JOIN spaces s ON r.space_id = s.id
        GROUP BY mes
        ORDER BY MONTH(start_date)
    """)
    resultados = cursor.fetchall()

    cursor.close()
    conn.close()

    data = {
        "labels": [fila[0] for fila in resultados],
        "values": [fila[1] for fila in resultados]
    }
    return jsonify(data)

# 1. Usuarios

@app.route('/api/analytics/usuarios/total')
def total_usuarios():
    conn = get_db2_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    total = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({'total': total})

@app.route('/api/analytics/usuarios/por-rol')
def usuarios_por_rol():
    conn = get_db2_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT rol, COUNT(*) FROM users GROUP BY rol")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/usuarios/activos-inactivos')
def usuarios_activos_inactivos():
    conn = get_db2_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT active, COUNT(*) FROM users GROUP BY active")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': ['Activo' if r[0] else 'Inactivo' for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/usuarios/nuevos-por-mes')
def usuarios_nuevos_por_mes():
    conn = get_db2_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) 
        FROM users 
        GROUP BY mes
        ORDER BY mes
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

# 2. Espacios de parqueo

@app.route('/api/analytics/espacios/total')
def total_espacios():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM spaces")
    total = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({'total': total})

@app.route('/api/analytics/espacios/activos-inactivos')
def espacios_activos_inactivos():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT active, COUNT(*) FROM spaces GROUP BY active")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': ['Activo' if r[0] else 'Inactivo' for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/espacios/ocupacion-por-hora')
def ocupacion_por_hora():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT HOUR(start_time), COUNT(*) 
        FROM reservations 
        GROUP BY HOUR(start_time)
        ORDER BY HOUR(start_time)
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [str(r[0]) for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/espacios/disponibilidad')
def disponibilidad_espacios():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, available_spaces FROM spaces")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

# 3. Reservas

@app.route('/api/analytics/reservas/total')
def total_reservas():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM reservations")
    total = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({'total': total})

@app.route('/api/analytics/reservas/por-estado')
def reservas_por_estado():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT status, COUNT(*) FROM reservations GROUP BY status")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/reservas/por-mes')
def reservas_por_mes():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DATE_FORMAT(start_date, '%Y-%m') as mes, COUNT(*) 
        FROM reservations 
        GROUP BY mes
        ORDER BY mes
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/reservas/por-tipo-vehiculo')
def reservas_por_tipo_vehiculo():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT type, COUNT(*) 
        FROM vehicles v
        JOIN reservations r ON v.id = r.vehicle_id
        GROUP BY type
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

# 4. Ingresos

@app.route('/api/analytics/ingresos/total')
def ingresos_totales():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT SUM(s.price_per_hour) 
        FROM reservations r
        JOIN spaces s ON r.space_id = s.id
    """)
    total = cursor.fetchone()[0] or 0
    cursor.close()
    conn.close()
    return jsonify({'total': total})

@app.route('/api/analytics/ingresos/por-mes')
def ingresos_por_mes():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DATE_FORMAT(r.start_date, '%Y-%m') as mes, SUM(s.price_per_hour)
        FROM reservations r
        JOIN spaces s ON r.space_id = s.id
        GROUP BY mes
        ORDER BY mes
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

@app.route('/api/analytics/ingresos/por-espacio')
def ingresos_por_espacio():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.name, SUM(s.price_per_hour)
        FROM reservations r
        JOIN spaces s ON r.space_id = s.id
        GROUP BY s.name
    """)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})

# 5. Vehículos

@app.route('/api/analytics/vehiculos/total')
def total_vehiculos():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM vehicles")
    total = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({'total': total})

@app.route('/api/analytics/vehiculos/por-tipo')
def vehiculos_por_tipo():
    conn = get_db1_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT type, COUNT(*) FROM vehicles GROUP BY type")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'labels': [r[0] for r in data], 'values': [r[1] for r in data]})





if __name__ == '__main__':
    app.run(port=5001, debug=True)