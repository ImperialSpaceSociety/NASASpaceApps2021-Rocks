import math
from matplotlib import pyplot as plt

import numpy as np
import scipy as sp
import scipy.misc

precision = np.single


class Model:
    vertices = np.empty((0, 3))
    faces = np.empty((0, 3))

    def load_obj(self, obj_path):
        file = open(obj_path, "r")
        lines = file.readlines()

        obj_vertices = []
        obj_faces = []

        for line in lines:
            values = line.split(" ")
            if values[0] == "v":
                obj_vertices.append([values[1], values[2], values[3]])
            elif values[0] == "f":
                obj_faces.append([values[1], values[2], values[3]])
        self.vertices = np.array(obj_vertices, dtype=precision)
        self.faces = np.array(obj_faces, dtype=np.int_)

    def rotate(self, x_angle, y_angle, z_angle, unit="rad", copy=True):
        if unit == "deg":
            x_angle = x_angle / 180 * np.pi
            y_angle = y_angle / 180 * np.pi
            z_angle = y_angle / 180 * np.pi

        x_sin = np.sin(x_angle)
        x_cos = np.cos(x_angle)

        y_sin = np.sin(y_angle)
        y_cos = np.cos(y_angle)

        z_sin = np.sin(z_angle)
        z_cos = np.cos(z_angle)

        x_rotation_matrix = np.array([[1, 0, 0], [0, x_cos, -x_sin], [0, x_sin, x_cos]], dtype=precision)
        y_rotation_matrix = np.array([[y_cos, 0, y_sin], [0, 1, 0], [-y_sin, 0, y_cos]], dtype=precision)
        z_rotation_matrix = np.array([[z_cos, -z_sin, 0], [z_sin, z_cos, 0], [0, 0, 1]], dtype=precision)

        rotation_matrix = np.matmul(np.matmul(x_rotation_matrix, y_rotation_matrix), z_rotation_matrix)

        out = np.array([np.matmul(rotation_matrix, vertex) for vertex in self.vertices])
        if not copy:
            self.vertices = out

        rotated = Model()
        rotated.vertices = out
        rotated.faces = self.faces
        return rotated

    def translate(self, vect, copy=True):
        out = np.array([vertex + vect for vertex in self.vertices])
        if not copy:
            self.vertices = out

        rotated = Model()
        rotated.vertices = out
        rotated.faces = self.faces
        return rotated


class Ray:
    def __init__(self, origin, point=None, direction=None):
        self.origin = origin
        if direction is None:
            self.direction = point - origin
        else:
            self.direction = direction


class Scene:

    def __init__(self):
        self.models = []
        self.camera_location = np.array([0, 0, 0], dtype=precision)
        self.screen_vector = np.array([1, 0, 0], dtype=precision)
        self.horizontal_fov = np.pi / 2
        self.screen_resolution = np.array([1000, 1000])

    def render(self):
        screen_distance = np.linalg.norm(self.screen_vector)
        pixel_step = np.tan(self.horizontal_fov / 2) * screen_distance / (self.screen_resolution[0] / 2)
        y_step = np.array([0, -pixel_step, 0])
        x_step = np.array([0, 0, pixel_step])

        frame_buffer = np.ones((self.screen_resolution[0], self.screen_resolution[1]), dtype=precision)

        for x_pixel in range(self.screen_resolution[0]):
            for y_pixel in range(self.screen_resolution[1]):
                screen_point = self.camera_location + self.screen_vector + \
                               y_step * (y_pixel - self.screen_resolution[1] / 2) + \
                               x_step * (x_pixel - self.screen_resolution[0] / 2)
                color = self.trace_ray(Ray(self.camera_location, point=screen_point))
                frame_buffer[y_pixel][x_pixel] = color

        return frame_buffer

    def trace_ray(self, ray):
        min_dist = float(10 ** 6)
        min_point = None
        min_face_id = None

        for model in self.models:
            for face_id, face in enumerate(model.faces):
                face_vertices = np.array(
                    [model.vertices[face[0] - 1], model.vertices[face[1] - 1], model.vertices[face[2] - 1]])
                intersection = self.get_triangle_intersection(ray, face_vertices)
                if intersection is not None:
                    distance = np.linalg.norm(intersection - ray.origin)
                    if distance < min_dist:
                        min_dist = distance
                        min_point = intersection
                        min_face_id = face_id
        if min_face_id is None:
            # return np.array([1.0, 1.0, 1.0])
            return 0.0
        else:
            # return np.array([1.0, 0, 0])
            return 1.0

    def tetrahedron_volume_sign(self, a, b, c, d):
        if np.dot(np.cross(b - a, c - a), d - a) > 0:
            return True
        else:
            return False

    def get_triangle_intersection_old(self, ray, points):
        # Check if they intersect at all - Method of volumes
        # https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
        far_1 = ray.origin + 100 * ray.direction
        far_2 = ray.origin - 100 * ray.direction

        if self.tetrahedron_volume_sign(far_1, points[0], points[1], points[2]) \
                != self.tetrahedron_volume_sign(far_2, points[0], points[1], points[2]):

            v1 = self.tetrahedron_volume_sign(far_1, far_2, points[0], points[1])
            v2 = self.tetrahedron_volume_sign(far_1, far_2, points[0], points[2])
            v3 = self.tetrahedron_volume_sign(far_1, far_2, points[1], points[2])

            if not (v1 == v2 and v2 == v3):
                plane_normal = np.cross(points[0] - points[1], points[0] - points[2])
                plane_const = np.dot(plane_normal, points[0])

                intersection_parameter = (plane_const - np.dot(plane_normal, ray.origin)) / np.dot(plane_normal,
                                                                                                   ray.direction)
                return ray.origin + intersection_parameter * ray.direction
        return None

    def get_triangle_intersection(self, ray, points):
        plane_normal = np.cross(points[0] - points[1], points[0] - points[2])
        plane_const = np.dot(plane_normal, points[0])

        # # Check for parallel
        # if plane_normal[0] / ray.direction[0] == plane_normal[1] / ray.direction[1] and plane_normal[0] / ray.direction[
        #     0] == plane_normal[2] / ray.direction[2]:
        #     return None

        intersection_parameter = (plane_const - np.dot(plane_normal, ray.origin)) / np.dot(plane_normal,
                                                                                           ray.direction)
        p_intersect_global = ray.origin + intersection_parameter * ray.direction
        p_intersect = p_intersect_global-points[0]

        Va = points[1] - points[0]
        Vb = points[2] - points[0]

        if (Va[0] * Vb[1] - Vb[0] * Va[1]) !=0:
            beta = (p_intersect[1] * Va[0] - p_intersect[0] * Va[1]) / (Va[0] * Vb[1] - Vb[0] * Va[1])

        elif (Va[1] * Vb[2] - Vb[1] * Va[2]) !=0:
            beta = (p_intersect[2] * Va[1] - p_intersect[1] * Va[2]) / (Va[1] * Vb[2] - Vb[1] * Va[2])

        if (Va[2] * Vb[0] - Vb[2] * Va[0]) !=0:
            beta = (p_intersect[0] * Va[2] - p_intersect[2] * Va[0]) / (Va[2] * Vb[0] - Vb[2] * Va[0])

        if Va[0] != 0:
            alpha = (p_intersect[0] - beta * Vb[0]) / Va[0]
        elif Va[1] != 0:
            alpha = (p_intersect[1] - beta * Vb[1]) / Va[1]
        elif Va[2] != 0:
            alpha = (p_intersect[2] - beta * Vb[2]) / Va[2]

        if beta >= 0 and alpha >= 0:
            if alpha + beta <= 1:
                return p_intersect
        return None

    def save_image(self, array):
        plt.imshow(array, interpolation='nearest')
        plt.show()


def main():
    teapot = Model()
    teapot.load_obj("charmander.obj")
    #teapot = teapot.rotate(0, 90, 0, "deg")

    teapot.vertices = np.array([[2, 1, -1], [2, -1, 1], [2, 1, 1]], dtype=precision)
    teapot.faces = np.array([[1, 2, 3]], dtype=np.int_)
    #teapot = teapot.translate(np.array([100, 0, 0], dtype=precision))
    scene = Scene()
    scene.models.append(teapot)
    bitmap = scene.render()
    scene.save_image(bitmap)
    print("Finished")

    ray = Ray(np.array([0, 1, 0], dtype=precision), direction=np.array([1, 0, 0], dtype=precision))
    s = s = Scene()
    print(s.get_triangle_intersection(ray, np.array([[2, 1, -1], [2, -1, 1], [2, 1, 1]], dtype=precision)))


main()
