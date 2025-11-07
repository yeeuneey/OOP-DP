// Visitor 인터페이스
interface Visitor {
  visitFile(file: FileElement): void
  visitFolder(folder: FolderElement): void
}

// Element 인터페이스
interface Element {
  accept(visitor: Visitor): void
}

// 파일(leaf)
class FileElement implements Element {
  name: string
  size: number

  constructor(name: string, size: number) {
    this.name = name
    this.size = size
  }

  accept(visitor: Visitor): void {
    visitor.visitFile(this) // 이중 디스패치 발생
  }
}

// 폴더(composite)
class FolderElement implements Element {
  name: string
  children: Element[]

  constructor(name: string, children: Element[] = []) {
    this.name = name
    this.children = children
  }

  accept(visitor: Visitor): void {
    visitor.visitFolder(this)
  }
}

// 파일 크기를 계산하는 Visitor
class SizeCalculator implements Visitor {
  private totalSize = 0

  visitFile(file: FileElement): void {
    this.totalSize += file.size
  }

  visitFolder(folder: FolderElement): void {
    folder.children.forEach(child => child.accept(this))
  }

  getTotalSize(): number {
    return this.totalSize
  }
}

// 이름을 출력하는 Visitor
class NamePrinter implements Visitor {
  visitFile(file: FileElement): void {
    console.log(`파일: ${file.name}`)
  }

  visitFolder(folder: FolderElement): void {
    console.log(`폴더: ${folder.name}`)
    folder.children.forEach(child => child.accept(this))
  }
}

// 파일 시스템 구성
const file1 = new FileElement("a.txt", 10)
const file2 = new FileElement("b.txt", 20)
const folder = new FolderElement("docs", [file1, file2])

// Visitor 사용
const sizeVisitor = new SizeCalculator()
folder.accept(sizeVisitor)
console.log("총 크기:", sizeVisitor.getTotalSize()) // 출력: 30

const nameVisitor = new NamePrinter()
folder.accept(nameVisitor)
// 출력:
// 폴더: docs
// 파일: a
