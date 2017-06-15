SELECT first.tripid
FROM (
	SELECT t.id as tripid, count(t.id) as counter
	FROM zones z, trips t
	WHERE
	CASE z.id WHEN <ID_Zona_Inicio> THEN ST_Intersects( z.geom::geometry , ST_StartPoint(t.geom::geometry))
	WHEN <ID_Zona_Fin> THEN ST_Intersects( z.geom::geometry , ST_EndPoint(t.geom::geometry)) END
	GROUP BY t.id) as first
WHERE first.counter > 1;
