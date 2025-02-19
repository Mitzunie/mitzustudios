import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { IGLogo } from "@/components/Icons/Instagram";
import { FacebookLogo } from '@/components/Icons/Facebook';
import { XIcon } from '@/components/Icons/Twitter';
import { GithubIcon } from '@/components/Icons/Github';
import { LinkedingIcon } from '@/components/Icons/Linkedin';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md w-full bg-card relative overflow-hidden">
        {/* BorderBeam aplicado solo a la tarjeta */}
        <BorderBeam
          duration={5}
          size={400}
          className="from-transparent via-purple-500 to-transparent"
        />
        <BorderBeam
          duration={5}
          delay={3}
          size={400}
          className="from-transparent via-cyan-500 to-transparent"
        />

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Contáctanos
          </CardTitle>
          <CardDescription className="text-center">
            ¿Tienes preguntas? Envíanos un mensaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Nombre
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="tucorreo@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Mensaje
              </label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full" variant={"primary"}>
              Enviar
            </Button>
          </form>
        </CardContent>

        {/* Footer con redes sociales */}
        <CardFooter className="flex justify-center space-x-4 mt-4">
          <a
            href="https://github.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-purple-500 transition-colors"
          >
            <GithubIcon className="h-6 w-6" />
          </a>
          <a
            href="https://twitter.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-blue-400 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </a>
          <a
            href="https://instagram.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-pink-500 transition-colors"
          >
            <IGLogo className="h-6 w-6" />
          </a>
          <a
            href="https://linkedin.com/in/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <LinkedingIcon className="h-6 w-6" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}