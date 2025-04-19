import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

export default function PreviewSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Tools for Every Creator</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Explore our professional-grade tools designed to make website creation accessible to everyone.</p>
        </div>

        {/* Dashboard Preview */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-4">Intuitive Dashboard</h3>
            <p className="text-gray-600 mb-6">Manage all your projects, assets, and settings from one central location. Our clean interface makes navigation simple and efficient.</p>
            <ul className="space-y-3">
              {[
                "Create new projects with templates or AI",
                "Access and manage your storage",
                "View analytics and performance metrics",
                "Manage domains and publishing settings"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-white p-2 rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <div className="p-8 text-gray-400 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                  />
                </svg>
                <p className="text-sm">Dashboard interface</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Code Editor Preview */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1 bg-[#1e1e1e] p-4 rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-400 text-xs">index.html</div>
            </div>
            <div className="code-editor p-4 rounded overflow-hidden font-mono text-sm">
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">1</div>
                <div><span className="token-punctuation">&lt;</span><span className="token-tag">!DOCTYPE html</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">2</div>
                <div><span className="token-punctuation">&lt;</span><span className="token-tag">html</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">3</div>
                <div><span className="token-punctuation">&lt;</span><span className="token-tag">head</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">4</div>
                <div>  <span className="token-punctuation">&lt;</span><span className="token-tag">title</span><span className="token-punctuation">&gt;</span>My Website<span className="token-punctuation">&lt;/</span><span className="token-tag">title</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">5</div>
                <div>  <span className="token-punctuation">&lt;</span><span className="token-tag">link</span> <span className="token-attr-name">rel</span><span className="token-punctuation">=</span><span className="token-attr-value">"stylesheet"</span> <span className="token-attr-name">href</span><span className="token-punctuation">=</span><span className="token-attr-value">"styles.css"</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">6</div>
                <div><span className="token-punctuation">&lt;/</span><span className="token-tag">head</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">7</div>
                <div><span className="token-punctuation">&lt;</span><span className="token-tag">body</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">8</div>
                <div>  <span className="token-punctuation">&lt;</span><span className="token-tag">h1</span><span className="token-punctuation">&gt;</span>Welcome to SPX STUDIO<span className="token-punctuation">&lt;/</span><span className="token-tag">h1</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">9</div>
                <div>  <span className="token-punctuation">&lt;</span><span className="token-tag">p</span><span className="token-punctuation">&gt;</span>This is my awesome website.<span className="token-punctuation">&lt;/</span><span className="token-tag">p</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">10</div>
                <div>  <span className="token-comment">&lt;!-- More content here --&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">11</div>
                <div><span className="token-punctuation">&lt;/</span><span className="token-tag">body</span><span className="token-punctuation">&gt;</span></div>
              </div>
              <div className="flex">
                <div className="editor-line-numbers w-8 pr-2">12</div>
                <div><span className="token-punctuation">&lt;/</span><span className="token-tag">html</span><span className="token-punctuation">&gt;</span></div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4">Professional Code Editor</h3>
            <p className="text-gray-600 mb-6">Modeled after VS Code, our editor provides a familiar environment for developers with all the features you need.</p>
            <ul className="space-y-3">
              {[
                "Syntax highlighting for HTML, CSS, JavaScript and more",
                "Live preview as you code",
                "Intelligent code completion",
                "Integrated terminal and debugging tools"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Website Generator Preview */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">AI Website Generator</h3>
            <p className="text-gray-600 mb-6">Describe your vision and watch as our AI creates a website matching your requirements. Fine-tune the results to perfection.</p>
            <ul className="space-y-3">
              {[
                "Generate complete websites from text descriptions",
                "Choose from AI-suggested color schemes and layouts",
                "Edit and customize the generated results",
                "Generate appropriate content for your industry"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Describe your website</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                rows={3} 
                placeholder="Create a professional photography portfolio with a dark theme, gallery section, and contact form..."
              ></textarea>
            </div>
            <button className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-600 transition-colors">Generate Website</button>
            <div className="mt-4 bg-gray-100 rounded-md p-3">
              <div className="flex items-center mb-2">
                <Badge variant="success" className="mr-2">
                  <span className="bg-green-500 rounded-full block h-2 w-2 mr-1"></span>
                  <span>Ready</span>
                </Badge>
                <span className="text-sm text-gray-600">AI suggestions will appear here</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-1 rounded border border-gray-200">
                    <div className="aspect-[16/9] bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
