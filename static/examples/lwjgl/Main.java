// Example using LWJGL 2.9.0
// Warning: experimental!

import org.lwjgl.LWJGLException;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;

public class Main {
    public static void main(String[] args) {
        try {
            Display.setDisplayMode(new DisplayMode(800, 600));
            Display.setTitle("Triangle Example");
            Display.create();
        } catch (LWJGLException e) {
            e.printStackTrace();
            System.exit(1);
        }

        // Initialize OpenGL
        GL11.glMatrixMode(GL11.GL_PROJECTION);
        GL11.glLoadIdentity();
        GL11.glOrtho(0, 800, 0, 600, 1, -1);
        GL11.glMatrixMode(GL11.GL_MODELVIEW);

        while (!Display.isCloseRequested()) {
            // Clear the screen
            GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);

            // Draw a triangle
            GL11.glBegin(GL11.GL_TRIANGLES);
            GL11.glColor3f(1.0f, 0.0f, 0.0f); // Red
            GL11.glVertex2f(400, 100);
            GL11.glColor3f(0.0f, 1.0f, 0.0f); // Green
            GL11.glVertex2f(100, 500);
            GL11.glColor3f(0.0f, 0.0f, 1.0f); // Blue
            GL11.glVertex2f(700, 500);
            GL11.glEnd();

            Display.update();
        }

        Display.destroy();
    }
    
}
