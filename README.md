## Features

**Easy to install:** easy as...

### 1

```sh
npm install -g typescript-jupyter-kernel
```

### 2

```
ts-kernel install
```

### 3

```sh
jupyter kernelspec list

# Available kernels:
#  typescript        ~/.local/share/jupyter/kernels/typescript
```

**Code completion:** using the `TAB` key, driven by the official [Typescript LSP Server](https://github.com/typescript-language-server/typescript-language-server) (same used by VSCode)

![](https://raw.githubusercontent.com/simplyhexagonal/typescript-jupyter-kernel/main/assets/typescript-jupyter-kernel-code-completion.gif)

**Use NPM dependencies:** simply navigate to your notebook's directory and add a `package.json` file

```sh
cd /path/to/notebook
npm init
npm install --save short-unique-id
```

**Fully written in Typescript:** the kernel is written entirely in Typescript 🦾

**SWC Optimized:** the kernel compiles your code with [SWC](https://github.com/swc-project/swc), making it blazing fast!

**Able to render HTML:** the kernel can render HTML in the notebook

![](https://raw.githubusercontent.com/simplyhexagonal/typescript-jupyter-kernel/main/assets/typescript-jupyter-kernel-html-output.png)

**Custom output command:** the kernel includes a handy `jupyter.out` function so your notebooks
aren't riddled with unsightly `console.log` calls

**Fully compatible:** works both in JupyterLab and Jupyter Notebook

![](https://raw.githubusercontent.com/simplyhexagonal/typescript-jupyter-kernel/main/assets/typescript-jupyter-kernel-in-jupyter-lab.png)
