import Photo from "@/components/Photo";
import Social from "@/components/Social";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-12 pt-6 xl:pt-0">
          <div className="text-left order-2 xl:order-none">
            <span
              className="text-xl font-medium"
              style={{ color: "var(--secondary-color)" }}
            >
              Software Engineer
            </span>
            <h1 className="h1 mb-6">
              Hello I&apos;m <br />
              <span style={{ color: "var(--accent-color)" }}>Daniel Mai</span>
            </h1>
            <div
              className="max-w-[500px] mb-9 flex flex-col gap-3 leading-relaxed text-sm"
              style={{ color: "var(--text-color)" }}
            >
              <p>
                Currently at{" "}
                <a
                  href="https://parkwithgryd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--accent-color)" }}
                >
                  GrydPark
                </a>
                , building full-stack B2B/B2C parking services across web and
                mobile. I work across the whole stack - from React frontends to
                NestJS APIs and PostgreSQL - with a deeper focus on backend
                systems and cloud infrastructure on GCP using Terraform, Docker,
                and Kubernetes.
              </p>
              <p>
                I studied Computer Science (BSc Honors) at the University of
                Manitoba. My interest in problem solving goes back to high
                school math competitions - what stuck was learning how to find
                the right angle on a hard problem. That led me into ML research
                at the Database Datamining Lab, and eventually into software.
              </p>
              <p>
                Outside of work, I keep up with the AI space by building
                personal projects around LLMs, RAG pipelines, and AI-powered
                tooling - exploring how these systems can be designed and
                integrated into real products. I also{" "}
                <a
                  href="https://blog.codewithdmai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--accent-color)" }}
                >
                  write about
                </a>
                {" "}systems design, distributed systems, and things I learn
                along the way.
              </p>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-start gap-8">
              <a
                href="/Daniel_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="uppercase flex items-center gap-2"
                >
                  <span>View Resume</span>
                </Button>
              </a>
              <a
                href="https://blog.codewithdmai.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="uppercase flex items-center gap-2"
                >
                  <span>Read Blog</span>
                </Button>
              </a>
              <div className="mb-8 xl:mb-0">
                <Social
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="order-1 xl:order-none mb-2 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
